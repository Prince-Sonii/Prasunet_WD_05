const displayCityName = document.getElementById("city_name");
const displayStateName = document.getElementById("state");
const displayCountryName = document.getElementById("country");
const displayTemp = document.getElementById("temp");
const displayIcon = document.getElementById("temp_icon");
const displayIconDesc = document.getElementById("icon_desc");
const displaySunsRise = document.getElementById("sunrise");
const displaySunSet = document.getElementById("sunset");
const displayHumidity = document.getElementById("humidity");
const displayVisibility = document.getElementById("visibility");
const displayErrorMobile = document.getElementById("error_mob");
const displayErrorPc = document.getElementById("error");
const apiKey = '9f043098f423de652b191ffb50d0690b';
const getLocation = async ()=>{   
    navigator.geolocation.getCurrentPosition(displayLocation, displayError);
    
}
const displayLocation = async (position)=>{
    let lat = await position.coords.latitude;
    let long = await position.coords.longitude;
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`)
    let data = await response.json();
    let r1 = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${data.name}&limit=1&appid=${apiKey}`);
    let state = await r1.json();
    displayCityName.innerText = data.name+",";
    displayStateName.innerText = state[0].state+", "; 
    displayCountryName.innerText = data.sys.country;
    displayTemp.innerText = Math.round(10*(data.main.temp-273.15))/10+`\u00B0`;
    let iconCode = data.weather[0].icon;
    displayIcon.src =iconMapping[iconCode];
    displayIconDesc.innerText = data.weather[0].description;
    const dateRise = new Date(data.sys.sunrise*1000);
    const dateSet = new Date(data.sys.sunset*1000);
    displaySunsRise.innerText = dateRise.getHours()+":"+dateRise.getMinutes()+":"+dateRise.getSeconds();
    displaySunSet.innerText = dateSet.getHours()+":"+dateSet.getMinutes()+":"+dateSet.getSeconds();
    displayHumidity.innerText = data.main.humidity+"%";
    displayVisibility.innerText = (data.visibility)/1000+"Km";
    displayTodayForecast(lat,long);
    displayFiveDayForecast(lat,long);
}
const displayError =  ()=>{
    displayData("london");
}
getLocation();
const iconMapping = {
    '01d': 'images/01d.png',
    '01n': 'images/01n.png',
    '02d': 'images/02d.png',
    '02n': 'images/02n.png',
    '03d': 'images/03dn.png',
    '03n': 'images/03dn.png',
    '04d': 'images/04dn.png',
    '04n': 'images/04dn.png',
    '09d': 'images/09dn.png',
    '09n': 'images/09dn.png',
    '10d': 'images/10dn.png',
    '10n': 'images/10dn.png',
    '11d': 'images/11dn.png',
    '11n': 'images/11dn.png',
    '13d': 'images/13dn.png',
    '13n': 'images/13dn.png',
    '50d': 'images/50d.png',
    '50n': 'images/50n.png'
};
const submitButtonMobiles = document.getElementById("mob_submit_btn");
const submitButton = document.getElementById("submit_btn");
const searchAreaMobiles = document.getElementById("search_area_mob");
const searchArea = document.getElementById("search_area");
submitButtonMobiles.addEventListener("click", ()=>{
    let cityName = searchAreaMobiles.value.trim();
    if(cityName=="") {
        displayErrorMobile.style.display = "block";
        setTimeout(()=>{
            displayErrorMobile.style.display = "none";
        },1200)
    } else {
        displayData(cityName);
    }
})
submitButton.addEventListener("click",()=>{
    submitButton.style.transform = "scale(.9)"
    setTimeout(()=>{
        submitButton.style.transform = "scale(1)"
    },100)
    let cityName = searchArea.value.trim();
    if(cityName=="") {
        displayErrorPc.style.display = "block";
        setTimeout(()=>{
            displayErrorPc.style.display = "none";
        },1200)
    } else {
        displayData(cityName);
    }
})
const displayData = async (cityName)=>{
    let r1 = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`);
    let coords = await r1.json();
    let name = coords[0].name;
    let country = coords[0].country;
    let latitude = coords[0].lat;
    let longitude = coords[0].lon;
    displayCityName.innerText = name+",";
    let s1 = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=${apiKey}`);
    let state = await s1.json();
    displayStateName.innerText = state[0].state+", "; 
    displayCountryName.textContent = country;
    let r2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    let data = await r2.json();
    displayTemp.innerText = Math.round(10*(data.main.temp-273.15))/10+`\u00B0`;
    let iconCode = data.weather[0].icon;
    displayIcon.src =iconMapping[iconCode];
    displayIconDesc.innerText = data.weather[0].description;
    const dateRise = new Date(data.sys.sunrise*1000);
    const dateSet = new Date(data.sys.sunset*1000);
    displaySunsRise.innerText = dateRise.getHours()+":"+dateRise.getMinutes()+":"+dateRise.getSeconds();
    displaySunSet.innerText = dateSet.getHours()+":"+dateSet.getMinutes()+":"+dateSet.getSeconds();
    displayHumidity.innerText = data.main.humidity+"%";
    displayVisibility.innerText = (data.visibility)/1000+"Km";
    displayTodayForecast(latitude, longitude);
    displayFiveDayForecast(latitude, longitude)
}
const displayTodayForecast = async (latitude,longitude)=>{
    let r = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    let data = await r.json();
    const forecastList = data.list;
    const today = new Date().toLocaleDateString('en-GB',{
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })
    // const currentTime = new Date().getTime();
    // const todayForecast = forecastList.filter(items => {
    //     const forecastTime = new Date(items.dt * 1000).getTime();
    //     return items.dt_txt.includes(today) && forecastTime >= currentTime;
    // });

    const todayForecast = forecastList.filter(items =>{
        const date = new Date(items.dt * 1000).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          });
        return date === today;
    })
    for(let i=1;i<todayForecast.length;i++) {
        document.getElementById(`${i}`).innerText = Math.round(10*(todayForecast[i].main.temp-273.15))/10+`\u00B0`;
    }
}
const displayFiveDayForecast = async(latitude, longitude) =>{
    let r = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    let data = await r.json();
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let fiveDayForecast = data.list.filter(forecast => {
        let forecastDate = new Date(forecast.dt_txt);
        let timePart = forecast.dt_txt.split(' ')[1];
        return forecastDate.getDate() >= tomorrow.getDate() && timePart==="00:00:00";
    });
    for(let i=0;i<4;i++) {
        let iconCode = fiveDayForecast[i].weather[0].icon;
        let getTime = new Date(fiveDayForecast[i].dt_txt);
        document.getElementById(`day${i+1}_img`).src = iconMapping[iconCode];
        document.getElementById(`day${i+1}_temp`).innerText = Math.round(10*(fiveDayForecast[i].main.temp-273.15))/10+`\u00B0`;
        document.getElementById(`day${i+1}_time`).innerText = `${getTime.getDate()}/${getTime.getMonth()}/${getTime.getFullYear()}`;
        document.getElementById(`day${i+1}_desc`).innerText = fiveDayForecast[i].weather[0].description;
    }
}