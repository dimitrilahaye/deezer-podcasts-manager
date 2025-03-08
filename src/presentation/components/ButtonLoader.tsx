import type React from "react";

const ButtonLoader: React.FC = () => {
  return (
    <span className="loader" aria-label="Mise à jour...">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="spinner"
        viewBox="0 0 16 16"
      >
        <title>en chargement</title>
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8z"
          strokeDasharray="44"
          strokeDashoffset="22"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">Chargement...</span>
    </span>
  );
};

export default ButtonLoader;
