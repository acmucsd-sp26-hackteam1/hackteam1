import geiselLibrary from '../assets/ucsd-library-night-photo-20180-753838.jpg';


function Home() {
  return (
    <section className="hero-section">
      <img src={geiselLibrary} alt="A picture of Geisel Library at UCSD" className="hero-image"/>
      <div className="hero-content">
        <h1>UCSD Time (Not Official Title)</h1>
        <p>A place to coordinate classes with your friends. <br/>Easily share your calendar, see who is free, and plan your days together!</p>
      </div>
    </section>
  );
}

export default Home;
