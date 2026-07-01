import "./ActionFooter.css";

interface ActionFooterProps {
  buttonText: string;
  handleClick: (buttonText: string) => void;
}

export default function ActionFooter({
  buttonText,
  handleClick,
}: ActionFooterProps) {
  return (
    <div className="action-footer">
      <button
        className="action-footer-button"
        onClick={() => handleClick(buttonText)}
      >
        {buttonText}
      </button>
    </div>
  );
}