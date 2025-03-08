const ErrorComponent: React.FC<{ error: string }> = ({ error }) => {
  return <div>{error}</div>;
};

export default ErrorComponent;
