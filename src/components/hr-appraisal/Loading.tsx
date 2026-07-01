import "./Loading.css";

const Loading = () => {
  return (
    <div className="hr-skeleton-card">
      <div className="hr-skeleton-title" />
      <div className="hr-skeleton-line" />
      <div className="hr-skeleton-line short" />
      <div className="hr-skeleton-line" />
      <div className="hr-skeleton-line short" />
    </div>
  );
};

export default Loading;