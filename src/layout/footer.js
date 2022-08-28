export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="sticky-footer bg-white">
      <div className="container my-auto">
        <div className="copyright text-center my-auto">
          <span>All rights reserved {year}</span>
        </div>
      </div>
    </footer>
  );
}
