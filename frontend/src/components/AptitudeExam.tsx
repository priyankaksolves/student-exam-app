import { useEffect, useState } from "react";
import { Question } from "../interfaces/Question";
import { Container, Form } from "react-bootstrap";
import { Option } from "../interfaces/Option";
import { Exam } from "../interfaces/exam";
import { getMonitoringUrl } from "../api";
import { useAuth } from "../authContext/AuthContext";
import { toast } from "react-toastify";

interface AptitudeExamProps {
  studentExamId: number;
  exam: Exam;
  setResponses: React.Dispatch<
    React.SetStateAction<{ [key: number]: number | boolean | number[] | null }>
  >;
  responses: { [key: number]: number | number[] | boolean | null };
}

const AptitudeExam: React.FC<AptitudeExamProps> = ({
  exam,
  studentExamId,
  setResponses,
  responses,
}) => {
  const { user } = useAuth();
  const [smowlUrl, setSmowlUrl] = useState("");
  const [proctoringReady, setProctoringReady] = useState(false);

  useEffect(() => {
    const fetchMonitoringUrl = async () => {
      try {
        if (!user) return;
        const response = await getMonitoringUrl(
          user.user_id,
          user.first_name,
          user.email,
          studentExamId
        );
        if (response.data.url) setSmowlUrl(response.data.url);
      } catch (error) {
        toast.error("Failed to load proctoring session.");
      }
    };

    fetchMonitoringUrl();
  }, [user, studentExamId]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://app.smowltech.net") return;

      if (event.data === "monitoringstatusOK") {
        setProctoringReady(true);
        toast.success("Exam started successfully!", { autoClose: 3000 });
      } else if (event.data === "monitoringstatusNOTOK") {
        setProctoringReady(false);
        toast.error(
          "⚠️ SMOWL CM is closed! Restart SMOWL CM to continue the exam."
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // Initialize state with no selection
    const initialResponses: {
      [key: number]: number | number[] | boolean | null;
    } = {};
    exam.questions.forEach((q: Question) => {
      if (q.question_type === "true_false") {
        initialResponses[q.question_id!] = null;
      } else {
        initialResponses[q.question_id!] = [];
      }
    });
    setResponses(initialResponses);
  }, [studentExamId]);

  // Handle option selection
  const handleOptionChange = (
    questionId: number,
    value: number | boolean,
    questionType?: string
  ) => {
    setResponses((prevResponses) => {
      if (questionType === "multi_select") {
        const prevSelection = Array.isArray(prevResponses[questionId])
          ? (prevResponses[questionId] as number[])
          : [];
        return {
          ...prevResponses,
          [questionId]: prevSelection.includes(value as number)
            ? prevSelection.filter((id) => id !== value)
            : [...prevSelection, value as number],
        };
      }

      return {
        ...prevResponses,
        [questionId]: value,
      };
    });
  };

  return smowlUrl ? (
    <>
      <h5 className="text-muted mt-3">
        <span className="text-danger">Important:</span> Do not close the "SMOWL
        CM" application while taking the exam, as doing so may result in your
        exam restarting.
      </h5>
      <div className="d-flex">
        <Container className="mt-4">
          <h2>{exam.title}</h2>
          <p>Duration: {exam.duration} minutes</p>
          {!proctoringReady ? (
            <p> **Waiting for SMOWL Proctoring to Start...**</p>
          ) : (
            exam.questions.map((question: Question, index: number) => (
              <div key={question.question_id} className="mb-4">
                <h4>
                  {index + 1}. {question.question_text}
                </h4>
                <Form>
                  {question.question_type !== "true_false" ? (
                    question.options?.map((option: Option) => (
                      <Form.Check
                        key={option.option_id}
                        type={
                          question.question_type === "multi_select"
                            ? "checkbox"
                            : "radio"
                        }
                        label={option.option_text}
                        name={`question_${question.question_id}`}
                        checked={
                          question.question_type === "multi_select"
                            ? (
                                responses[question.question_id!] as number[]
                              )?.includes(option.option_id!) || false
                            : responses[question.question_id!] ===
                              option.option_id
                        }
                        onChange={() =>
                          handleOptionChange(
                            question.question_id!,
                            option.option_id!,
                            question.question_type
                          )
                        }
                      />
                    ))
                  ) : (
                    <>
                      <Form.Check
                        type="radio"
                        label="True"
                        name={`question_${question.question_id}`}
                        checked={
                          responses[question.question_id!] === true || false
                        }
                        onChange={() =>
                          handleOptionChange(
                            question.question_id!,
                            true,
                            "true_false"
                          )
                        }
                      />
                      <Form.Check
                        type="radio"
                        label="False"
                        name={`question_${question.question_id}`}
                        checked={
                          responses[question.question_id!] === false || false
                        }
                        onChange={() =>
                          handleOptionChange(
                            question.question_id!,
                            false,
                            "true_false"
                          )
                        }
                      />
                    </>
                  )}
                </Form>
              </div>
            ))
          )}
        </Container>
        <div className="mt-2">
          <iframe
            src={smowlUrl}
            width="100%"
            height="400px"
            frameBorder="0"
            allow="microphone; camera"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
      </div>
    </>
  ) : (
    <p>Loading proctoring session...</p>
  );
};

export default AptitudeExam;
