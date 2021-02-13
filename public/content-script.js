console.log("Hello from console script :)")

const eventCountUpdatedAdd = new Event('countUpdatedAdd') 
const eventCountUpdatedRem = new Event('countUpdatedRem') 

Vue.prototype.$count = {count: 0}

const vmData = new Vue({
  data: {
    count: 0
  }
})

let messages = []

let app;

let count = 0

const data = {
  channels: [],
  matches: [],
  ignored: [],
  notifications: false
}

browser.storage.local.get(Object.keys(data)).then((newData) => {
  Object.assign(data, newData)
}) 

// update data object when browser storage is updated
browser.storage.onChanged.addListener((changes) => {
  Object.keys(changes).forEach((key) => {
    data[key] = changes[key].newValue
  })
  console.log(data)
})

const client = new tmi.Client({
	connection: { reconnect: true },
  channels: [window.location.pathname.slice(1)]
});

client.connect()

function removeMessage(id) {

}

function matchedTerm(message, channel, tags) {
  return new Promise((res, rej) => {
    if (data.ignored.includes(tags['display-name'].toLowerCase())) {
      return rej("Ignored User")
    }
    console.log('this ran')
    const msg = message.toLowerCase().split(" ")
    data.matches.forEach((t) => {
      if (msg.includes(t) || msg.includes("@" + t)) {
        return res(t)
      }
    })
    return rej("No match found")
  })
}

// window.onload = (event) => {
//   console.log('finished loading')
// })

let div = document.createElement('div')

function attachIcon() {
  // const head = document.getElementsByClassName('stream-chat-header')[0]
  const head = document.getElementsByClassName('chat-input__buttons-container')[0].children[1]
  const notiDiv = document.createElement('div')
  notiDiv.id = "notiDiv"
  notiDiv.innerHTML = "<icon></icon>"
  // const button = document.createElement('button')
  // button.innerText = "🔔"
  // button.id = "btnNoti"
  // button.className = "tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-core-button tw-inline-flex tw-justify-content-center tw-overflow-hidden tw-relative"
  // button.onclick = () => {
  //   const notiArea = document.getElementById("notiArea")
  //   console.log("notiArea modCheck?: " + notiArea)
  //   if (notiArea) {
  //     div = $("#notiArea").detach()
  //   } else {
  //     $(".chat-input").prepend(div)
  //   }
  //   console.log("hello :)")
  // }
  // head.prepend(button)
  head.prepend(notiDiv)
  app2.$mount("#notiDiv")
  // head.children[0].prepend(button)
}

function attachNotiArea() {
  div.id = "notiArea"
  div.style.width = '100%'
  div.style.height = '100px'
  div.style.backgroundColor = "#0e0e10";
  div.style.overflow = "auto"
  div.innerHTML = "<noti></noti>"
  // div.innerHTML = "<icon></icon>"
  console.log("attaching noti area")
  document.getElementsByClassName('chat-input')[0].prepend(div)
  app.$mount("#notiArea")
  const chart = document.createElement('div')
  chart.id = "chart"
  div.appendChild(chart)
  div = $("#notiArea").detach()
}

var existCondition = setInterval(function() {
 if ($('.stream-chat-header').length) {
    clearInterval(existCondition);
    attachIcon();
 }
}, 100); // check every 100ms

var existCondition2 = setInterval(function() {
  //$('.stream-chat-header').length && 
 if (document.getElementsByClassName('tw-z-default')[4]) {
    clearInterval(existCondition2);
    attachNotiArea();
 }
}, 100); // check every 100ms

Vue.component('icon', {
  data() {
    return {
      count: 0
    }
  },
  created() {
    window.addEventListener('countUpdatedAdd', () => {
      this.count += 1
    })
    window.addEventListener('countUpdatedRem', () => {
      this.count -= 1
    })
  },
  methods: {
    test() {
      const notiArea = document.getElementById("notiArea")
      if (notiArea) {
        div = $("#notiArea").detach()
      } else {
        $(".chat-input").prepend(div)
      }
    }
  },
  template: `
<div class="tw-inline-flex">
   <button aria-describedby="5c63ad385cfb409de247697b5a7b2a20"
    class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--text tw-inline-flex tw-justify-content-center tw-overflow-hidden tw-relative"
    v-on:click="test"
    >
      <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
         <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
            <div class="tw-align-items-center tw-flex">
               <div class="tw-flex tw-mg-r-05">
                  <div class="tw-inline-flex">🔔</div>
               </div>
               <div data-test-selector="balance-string" class="tw-c-text-alt-2 tw-flex"><span class="tw-animated-number">{{count}}</span></div>
            </div>
         </div>
      </div>
   </button>
</div>  
`
})

Vue.component('noti', {
  data: function () {
    return {
      msgs: messages,
      count: 0
      // count: 0
    }
  },
  methods: {
    clicked(msg) {
      let input = ""
      console.log(msg)
      const inputField = document.getElementsByClassName('chat-input__textarea')[0].children[0].children[0]
      inputField.focus()
      inputField.value = `@${msg.username} `
    },
    del(msg) {
      this.msgs = this.msgs.filter((el) => {
        return el.id != msg.id
      })
      window.dispatchEvent(eventCountUpdatedRem)
    },
  },
  created() {
    client.on('message', (channel, tags, message, self) => {
      matchedTerm(message, channel, tags).then((matchedTerm) => {
        console.log(`matched with ${matchedTerm}`)
        this.msgs.push({id: this.count, username: tags['display-name'], msg: message})
        this.count++
        window.dispatchEvent(eventCountUpdatedAdd)
      })
    });
  },
  // template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
  template: `
    <ul id="example-1">
      <li v-for="msg in msgs">
        {{ msg.username }} {{ msg.msg }} <button class="default" v-on:click="del(msg)">Delete</button>
      </li>
    </ul>
  `
})

app = new Vue({
  data: {
    msg: messages
  }
})

app2 = new Vue({
  data: {
    msg: messages
  }
})