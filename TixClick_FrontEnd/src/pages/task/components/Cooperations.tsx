import useCooperations from "../../../hooks/useCooperations";

const Cooperations = () => {
  const { listCompany, loading } = useCooperations();
  console.log(listCompany);
  return <div>Cooperations</div>;
};

export default Cooperations;
