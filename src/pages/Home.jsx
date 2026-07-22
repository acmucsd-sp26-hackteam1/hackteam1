import geiselLibrary from "../assets/ucsd-library-night-photo-20180-753838.jpg";
import HowToUseBox from "../components/HowToUseBox";

function Home() {
  return (
    <>
    <section className="hero-section">
      <img src={geiselLibrary} alt="A picture of Geisel Library at UCSD" className="hero-image"/>
      <div className="hero-content">
        <h1>UCSD Time (Not Official Title)</h1>
        <p>A place to coordinate classes with your friends. <br/>Easily share your calendar, see who is free, and plan your days together!</p>
      </div>
    </section>

    <section className="htu-section">
      <div className="htu-content">
        <h1>How to Use</h1>
        <p>This is how you use our website!</p>
      </div>


      <div className="htu-container">
        <HowToUseBox number = "01" picture = "[insert pic of log in]" label = "Log In" info = "Log in to start planning your semester with friends." />
        <HowToUseBox number = "02" picture = "[insert pic of calendar]" label = "Access Personal Calendar" info = "Link your work and personal schedules." />
        <HowToUseBox number = "03" picture = "[insert pic of friends list]" label = "Invite & Organize" info = "Create a group or join an exisiting circle. Find the perfect window for everyone without any hassle!" />
      </div>
    </section>

    </>
  );
}

export default Home;
