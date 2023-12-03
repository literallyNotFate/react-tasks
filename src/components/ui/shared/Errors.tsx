import { IError } from "../../../models/types";

const Errors: React.FC<IError> = ({ errors }) => {
  return (
    <>
      {errors.map((error, index) => (
        <div key={index} className="p-3 bg-red-500 text-white rounded-md mb-3">
          {error}
        </div>
      ))}
    </>
  );
};

export default Errors;
