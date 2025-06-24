import React from 'react'

const FieldError = ({ children }: { children?: string | string[] }) => {
  if (!children) return null;
  return (
    <div className="-mt-3 ml-1">
      <span className="text-xs text-red-700">
        {Array.isArray(children) ? children.join(", ") : children}
      </span>
    </div>
  );
};
export default FieldError
