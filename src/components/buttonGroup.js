export default function ButtonGroup({ id, children: buttons }) {
  return (
    <div id={id} className="flex min-h-full">
      {buttons.map((button, i) => {
        return (
          <div className="mx-2" key={i}>
            {button}
          </div>
        );
      })}
    </div>
  );
}
