interface ImportQuestionsProps {
  setFile: (file: File) => void;
}

const ImportQuestions: React.FC<ImportQuestionsProps> = ({setFile}) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="mt-3">
      <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
    </div>
  );
};

export default ImportQuestions;
