import { IError } from "../../models/types";

const Errors: React.FC<IError> = ({ errors }: IError) => {
  return (
    <>
      {errors.map((error, index) => (
        <div key={index} className="p-3 bg-red-400 text-white rounded-md mb-3">
          {error}
        </div>
      ))}
    </>
  );
};

export default Errors;
