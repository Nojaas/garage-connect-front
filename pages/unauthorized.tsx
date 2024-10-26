const Unauthorized = () => {
  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold text-red-500">Accès refusé</h1>
      <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
    </div>
  );
};

export default Unauthorized;
