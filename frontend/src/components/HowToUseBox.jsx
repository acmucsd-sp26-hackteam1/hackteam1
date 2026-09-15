function HowToUseBox({ number, label, info, picture }) { 
  return ( 
    <div className="htu-card"> 
      <div className="picture-box">
        {picture}
      </div>

      <div className="htu-row">
        <span className="htu-number">{number}</span> 
        
        <div className="htu-text">
          <h2 className="htu-label">{label}</h2> 
          <p className="htu-info">{info}</p> 
        </div>

      </div>
      
    </div> 
  ); 
}
export default HowToUseBox;