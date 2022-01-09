window.addEventListener("DOMContentLoaded", () => {
    let lon;
    let lat;
    const timeZone = document.getElementById("tz")
    const tempValue = document.getElementById("temp-value")
    const mess = document.getElementById("message")
    const icon = document.getElementById("icon")

    // weather
    function renewData(api) {
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                timeZone.innerText = data.name
                timeZone.setAttribute('data-after', data.sys.country)
                tempValue.innerText = Math.round(data.main.temp - 273)
                let w = data.weather
                let weather;
                for (let i of w) {
                    weather = i
                }
                mess.innerText = weather.description
                icon.src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`
            })
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;


            let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6b8c8cdeedb72650a3508e3a048f3b12`;

            renewData(api)
        })
    }



    // autocomplete
    const search = document.getElementById("input")
    const matchlist = document.getElementById("match-list")

    const btn = document.getElementById("btn")
    btn.addEventListener("click", () => {
        api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6b8c8cdeedb72650a3508e3a048f3b12`;
        renewData(api)
        btn.disabled = true
    })

    const searchStates = async searchText => {
        const res = await fetch('../data/cities.json')
        const states = await res.json()

        // get matches to current text input
        let matches = states.filter(state => {
            const regex = new RegExp(`^${searchText}`, 'gi')
            return state.name.match(regex)
        })
        if (searchText.length === 0) {
            matches = [];
            matchlist.innerHTML = '';
        }

        outputHtml(matches, states);
    }
    // show results in html
    const outputHtml = (matches, states) => {
        if (matches.length > 20) {  // for optimalization
            matches.splice(20, matches.length - 20)
        }
        if (matches.length > 0) {
            const html = matches.map(match => `
                <div class="match">
                    <h4>${match.name}<span class="ct">${match.country}</span></h4>
                </div>
            `)
                .join('');

            matchlist.innerHTML = html;
        }

        const myMatches = document.getElementsByClassName("match")
        for (let my of myMatches) {
            my.addEventListener("click", e => {
                let ct = e.target.innerText.substr(e.target.innerText.length - 2, e.target.innerText.length)
                let newStr = e.target.innerText.substr(0, e.target.innerText.length - 2)
                search.value = newStr
                lat = states.find(x => x.name == newStr && x.country == ct).lat
                lon = states.find(x => x.name == newStr && x.country == ct).lng
                matchlist.innerHTML = ''
                btn.disabled = false
            })
        }
    }

    search.addEventListener("input", () => searchStates(search.value))
})