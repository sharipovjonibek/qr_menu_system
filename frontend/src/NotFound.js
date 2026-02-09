import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="noise" />

      <div className="content">
        <h1>404</h1>
        <p>Oops! Page not found</p>

        <span>The page you are looking for doesn’t exist or was moved.</span>

        <a href="/">Go Home</a>
      </div>
    </div>
  );
}
