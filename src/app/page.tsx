export default function Home() {
  const typographyItems = [
    { label: "Header1", className: "text-header1", spec: "22 / 140" },
    { label: "Header2", className: "text-header2", spec: "18 / 140" },
    { label: "Subtitle1", className: "text-subtitle1", spec: "16 / 140" },
    { label: "Subtitle2", className: "text-subtitle2", spec: "14 / 140" },
    { label: "Body1", className: "text-body1", spec: "16 / 140" },
    { label: "Body2", className: "text-body2", spec: "14 / 140" },
    { label: "Caption", className: "text-caption", spec: "12 / 140" },
  ];

  const typographyList = (
    <div className="flex flex-col gap-6">
      {typographyItems.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2">
          <span className={item.className}>Ag</span>
          <span className={item.className}>{item.label}</span>
          <span className="text-body2 text-muted-foreground">
            · {item.spec}
          </span>
        </div>
      ))}
    </div>
  );

  const colorList = (
    <div className="mt-10 grid gap-3">
      <div className="flex items-center gap-3">
        <span className="size-8 rounded-lg bg-main" />
        <span className="text-body2">main · #0EBD7A</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="size-8 rounded-lg bg-sub" />
        <span className="text-body2">sub · #B3F73F</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="size-8 rounded-lg bg-primary-100" />
        <span className="text-body2">primary-100 · #0EBD7A</span>
      </div>
    </div>
  );

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div>
        {typographyList}
        {colorList}
      </div>
    </main>
  );
}
