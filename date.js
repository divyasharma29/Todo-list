
//console.log(module);

module.exports = function getDate() { 
    
    const today = new Date();
    console.log(today);
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
   
   const day = today.toLocaleDateString("US-en", options);
    return day;
  }
