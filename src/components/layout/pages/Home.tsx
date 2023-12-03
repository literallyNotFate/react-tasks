import FormButton from "../../ui/shared/FormButton";

const Home: React.FC = () => {
  return (
    <div className="text-white text-center">
      <h1 className="text-6xl font-bold mb-5">react-tasks</h1>
      <h2 className="text-3xl italic">Check products and appointments</h2>

      <div className="mt-12">
        <FormButton href="/products" size="lg">
          Get started
        </FormButton>
      </div>
    </div>
  );
};

export default Home;
