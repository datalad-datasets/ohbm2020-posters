function feedbackAnimationStep(timer, elem) {
  const dx = 500 * Math.random() - 250;
  const x = parseInt("0" + elem.style.left);
  const y = parseInt("0" + elem.style.top);
  const newx = 0.9*x + 0.1*(x+dx);
  const newy = y - 25;
  elem.style.left = newx + "px";
  elem.style.top = newy + "px";
  if(newy <= 0 ) {
    clearInterval(timer);
    elem.remove();
  }
}

function feedbackAnimation(emoji) {
  const elem = document.createElement('div');
  switch(emoji) {
    case 'rabbit':
      elem.innerHTML = `<img class="emoji" src="/assets/images/emoji_rabbit_1f407.png" />`;
      break;
    case 'brain':
      elem.innerHTML = `<img class="emoji" src="/assets/images/emoji_brain_1f9e0.png" />`;
      break;
    case 'heart':
        elem.innerHTML = `<img class="emoji" src="/assets/images/emoji_brain_1f9e0.png" />`;
      break;
    case 'rocket':
        elem.innerHTML = `<img class="emoji" src="/assets/images/emoji_smiling-face-with-smiling-eyes-and-three-hearts_1f970.png" />`;
      break;
    default:
      elem.innerHTML = `<img class="emoji" src="/assets/images/emoji_rabbit_1f407.png" />`;
  }
  elem.classList.add("feedback");
  document.body.appendChild(elem);
  elem.style.left = window.innerWidth/2.0 + "px";
  elem.style.top = window.innerHeight + "px";
  const timer = setInterval( () => {
    feedbackAnimationStep(timer, elem);
  }, 25);
}

function feedback(emoji) {
  feedbackAnimation(emoji);
  broadcastMessage({type:"feedback", emoji});
}

function broadcastMessage(msg) {
  for(const participant in api._participants) {
    let send = true;
    if(!{}.hasOwnProperty.call(api._participants, participant)) {
      continue;
    }
    const itsme = (api._participants[participant].formattedDisplayName.slice(-5) === " (me)");
    if(itsme) {
      continue;
    }
    api.executeCommand('sendEndpointTextMessage', participant, JSON.stringify(msg));
  }
}

function addDataChannelListener() {
  api.addEventListener('endpointTextMessageReceived', (rawMsg) => {
    const text = rawMsg.data.eventData.text;
    const msg = JSON.parse(text);
    switch(msg.type) {
      case "feedback":
        const emoji = msg.emoji;
        feedbackAnimation(emoji);
        break;
      case "clap":
        playClapSound();
        break;
    }
  });
}