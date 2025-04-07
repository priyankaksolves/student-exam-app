import { useEffect, useState } from "react";
import ControlledEditor, { OnChange } from "@monaco-editor/react";
import { toast } from "react-toastify";
import { fetchExecutionResult, submitCodeToJudge0 } from "../api";


interface CodeEditorProps {
  questionId: number;
  selectedLanguage: string;
  setSelectedLanguage: (languageId: string) => void;
  languages: { id: string; name: string }[];
  studentExamId: number;
}

const CodeEditor:React.FC<CodeEditorProps> = ({ questionId, selectedLanguage, setSelectedLanguage, languages, studentExamId }) => {

  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [isCustomInputChecked, setIsCustomInputChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [submitted, setSubmitted] = useState(false);

useEffect(() => {
  setSubmitted(localStorage.getItem(`Question ${questionId}`) === "true");
}, [questionId]);

const handleRunCode = async () => {
  try {
    setShowOutput(true);
    setIsProcessing(true);
    const data = await submitCodeToJudge0({
      source_code: code,
      language_id: selectedLanguage,
      stdin: input,
      question_id: questionId,
    });
    if (data.length === 1) {
      const result = await pollResult(data[0].token);
      setOutput(result);
    } else {
      setOutput(data);
    }
  } catch {
    setShowOutput(false);
    toast.error("Failed to execute code");
  } finally {
    setIsProcessing(false);
  }
};

const submitCode = async () => {
  try {
    setShowOutput(true);
    setIsProcessing(true);
    const data = await submitCodeToJudge0({
      source_code: code,
      language_id: selectedLanguage,
      question_id: questionId,
      submit: true,
      student_exam_id: studentExamId,
    });
    setOutput(data);
    setSubmitted(true);
    localStorage.setItem(`Question ${questionId}`, "true");
  } catch {
    setShowOutput(false);
    toast.error("Failed to execute code");
  } finally {
    setIsProcessing(false);
  }
};

const pollResult = async (token: string): Promise<any> => {
  const interval = 2000;
  const maxAttempts = 10;
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const data = await fetchExecutionResult(token);
    if (data.status.id !== 1 && data.status.id !== 2) return data;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error("Result timeout");
};

const handleEditorChange: OnChange = (value) => {
  setCode(value || "");
};

  const renderOutputStatus = (id: number) => {
    switch (id) {
      case 3:
        return (
          <div className="text-success fs-3">
            Compiled successfully <i className="bi bi-check2"></i>
          </div>
        );
      case 4:
        return (
          <div className="text-danger fs-3">
            Wrong answer <i className="bi bi-x-lg"></i>
          </div>
        );
      case 5:
        return (
          <div className="text-warning fs-3">
            Time Limit Exceeded <i className="bi bi-hourglass-split"></i>
          </div>
        );
      case 6:
        return (
          <div className="text-danger fs-3">
            Compilation Error <i className="bi bi-exclamation-circle-fill"></i>
          </div>
        );
      default:
        return (
          <div className="text-danger fs-3">
            Runtime Error <i className="bi bi-exclamation-lg"></i>
          </div>
        );
    }
  };

  const renderOutputDetails = () => {
    if (!Array.isArray(output)) {
      if (output?.status.id === 3) {
        return (
          <>
            <div className="fw-bold">Input</div>
            <div className="text-output">
              {output.stdin || "No input provided"}
            </div>
            <br />
            <div className="fw-bold">Output</div>
            <div className="text-muted">{output.stdout || "No output"}</div>
            <br />
            <div className="fw-bold">
              Execution Time:{" "}
              <span className="text-success">{output.time || "N/A"} sec</span>
            </div>
            <div className="fw-bold">
              Memory Used:{" "}
              <span className="text-secondary">
                {output.memory || "N/A"} KB
              </span>
            </div>
          </>
        );
      } else {
        return (
          <div className="text-danger">
            {output.stderr ||
              output.message ||
              output.compile_output ||
              "Error while executing code. Please try again."}
          </div>
        );
      }
    }

    return (
      <div>
        {output.map((submission: any, index: number) => (
          <div key={index} className="mb-4">
            <span className="badge bg-danger fs-6 mb-2">
              Test Case {index + 1}
            </span>
            {renderOutputStatus(submission.status.id)}
            <div className="fw-bold">Input</div>
            <div className="text-muted">{submission.stdin || "No input"}</div>
            <div className="fw-bold">Your Output</div>
            <div className="text-muted">{submission.stdout || "No output"}</div>
            <div className="fw-bold">Expected Output</div>
            <div className="text-muted">
              {submission.expected_output || "No output"}
            </div>
            <div className="fw-bold">
              Execution Time:{" "}
              <span className="text-success">
                {submission.time || "N/A"} sec
              </span>
            </div>
            <div className="fw-bold">
              Memory Used:{" "}
              <span className="text-secondary">
                {submission.memory || "N/A"} KB
              </span>
            </div>
            {submission.stderr && (
              <div className="text-danger">{submission.stderr}</div>
            )}
            {submission.compile_output && (
              <div className="text-danger">{submission.compile_output}</div>
            )}
            {submission.message && (
              <div className="text-danger">{submission.message}</div>
            )}
            <hr />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ overflow: 'auto', height: 'calc(80vh - 30px)' }}>
      <div className="d-flex bg-dark-subtle p-3">
        <label htmlFor="language-select" className="me-2">
          Language
        </label>
        <select
          className="p-1"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{ width: "250px" }}
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id} id="language-select">
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <ControlledEditor
          height="450px"
          language="javascript"
          value={code}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </div>
      <div className="bg-light">
        {submitted ? (
          <div className="text-success text-center p-3 fs-3">
            Your Code submitted Successfully
          </div>
        ) : (
          <div className="d-flex align-items-start p-3">
            <div className="d-flex flex-column me-auto">
              <div className="mb-2">
                <input
                  type="checkbox"
                  id="customInputCheckbox"
                  className="me-2"
                  checked={isCustomInputChecked}
                  onChange={(e) => {
                    setIsCustomInputChecked(e.target.checked);
                    setInput("");
                  }}
                />
                <label htmlFor="customInputCheckbox">
                  Run with custom input
                </label>
              </div>
              {isCustomInputChecked && (
                <textarea
                  className="form-control mt-2"
                  rows={4}
                  placeholder="Enter custom input here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ width: "300px" }}
                />
              )}
            </div>
            <div className="d-flex ms-auto align-items-start">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleRunCode}
              >
                Run Code
              </button>
              <button
                className="btn btn-success btn-sm ms-2"
                onClick={submitCode}
              >
                Submit Code
              </button>
            </div>
          </div>
        )}
        {showOutput && (
          <div className="mx-3 border border-light bg-white rounded">
            {isProcessing ? (
              <div className="d-flex fs-2 justify-content-center align-items-center p-3">
                Processing...
              </div>
            ) : (
              <div className="p-4">
                {output?.status?.id && renderOutputStatus(output.status.id)}
                <hr />
                {output && renderOutputDetails()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};



export default CodeEditor;