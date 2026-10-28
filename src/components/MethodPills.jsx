export default function MethodPills({ methods, activeMethod }) {
  return (
    <div className="method-pills">
      {methods.map((method) => (
        <span
          className={`method-pill ${method === activeMethod ? "is-active" : ""}`}
          key={method}
        >
          {method}
        </span>
      ))}
    </div>
  );
}
