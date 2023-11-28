const Navbar: React.FC = () => {
  return (
    <div className="p-6 shadow-lg rounded-lg bg-white mb-12 flex gap-5 w-1/5 mx-auto justify-center">
      <div>
        <a
          className="p-2 rounded-md w-full bg-white border border-black text-black hover:bg-white hover:text-black cursor-pointer"
          href="/products"
        >
          Home
        </a>
      </div>
      <div>
        <a
          className="p-2 rounded-md w-full bg-white border border-black text-black hover:bg-white hover:text-black cursor-pointer"
          href="/login"
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default Navbar;
