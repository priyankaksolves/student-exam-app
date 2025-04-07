import { useEffect } from "react";
import { Question } from "../interfaces/Question";
import { Container, Form } from "react-bootstrap";
import { Option } from "../interfaces/Option";
import { Exam } from "../interfaces/exam";

interface AptitudeExamProps {
  studentExamId: number;
  exam: Exam;
  setResponses: React.Dispatch<React.SetStateAction<{ [key: number]: number | boolean | number[] | null }>>;
  responses: { [key: number]: number | number[] | boolean | null };
}

const AptitudeExam: React.FC<AptitudeExamProps> = ({ exam, studentExamId, setResponses, responses }) => {


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

  return (
    <>
      <Container className="mt-4">
        <h2>{exam.title}</h2>
        <p>Duration: {exam.duration} minutes</p>

        {exam.questions.map((question: Question, index: number) => (
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
                        : responses[question.question_id!] === option.option_id
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
                    checked={responses[question.question_id!] === true || false}
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
        ))}
      </Container>
    </>
  );
};

export default AptitudeExam;
