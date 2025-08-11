const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
      <p className="text-gray-600">You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;