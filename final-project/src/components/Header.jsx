export default function Header() {
  return (
    <header>
      <h1><a href="#" className="logo-linkki">Lisäravinnekauppa</a></h1>

      <nav>
        <ul className="navigaatio-linkit">
          <li><a href="#">Lisäravinteet</a></li>
          <li><a href="#">Vaatteet</a></li>
          <li><a href="#">Varusteet</a></li>
          <li><a href="#">Kampanjat</a></li>
        </ul>
      </nav>

      <div className="profiili-nappi">
        <a href="#">Luo profiili</a>
      </div>
    </header>
  );
}
