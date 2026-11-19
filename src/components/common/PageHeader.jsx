import Stepper from './Stepper.jsx';

/** Steps 2-4: progress card + page title. */
export default function PageHeader({ step, title, subtitle, children }) {
  return (
    <div className="mb-4 animate-fade-up">
      <div className="card px-4 py-3 sm:px-6 sm:py-4">
        <Stepper step={step} />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-[26px]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500 sm:text-[15px]">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
