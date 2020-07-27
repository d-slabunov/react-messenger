import { chatName } from '../helpers/uniqChatName';
import * as Ably from "ably";

class AblyApi {
  ably;
  presenceChannel;
  chatChannel;
  adminChannel;

  constructor() {}

  init(currentUser) {
    this.ably = new Ably.Realtime({
      key: process.env.REACT_APP_ABLY_KEY,
      clientId: `id-${currentUser}`
    });

    this.presenceChannel = this.ably.channels.get('presence');
    this.chatChannel = this.ably.channels.get('chat');
    this.adminChannel = this.ably.channels.get('admin');
  }

  enterToPresenceChannel() {
    return enterChannel(this.presenceChannel);
  }

  leaveToPresenceChannel() {
    return leaveChannel(this.presenceChannel);
  }

  publishToChannel(isAdminChannel, text, addressee, currentUser) {
    return channelPublish(isAdminChannel ? this.adminChannel : this.chatChannel, text, isAdminChannel, addressee, currentUser)
  }

  subscribeToPresenceChannel(setOnlineUsers, subscribe) {
    return presenceChannelSubscribe(this.presenceChannel, setOnlineUsers, subscribe)
  }

  subscribeToChannel(setMessages, isAdminChannel, user, currentUser) {
    return channelSubscribe(isAdminChannel ? this.adminChannel : this.chatChannel, setMessages, isAdminChannel, user, currentUser)
  }

  getFromPresenceChannel(setOnlineUsers, isAdminChannel, currentUser) {
    return presenceChannelGet(this.presenceChannel, setOnlineUsers, isAdminChannel, currentUser, this.chatChannel)
  }
}

function enterChannel(channel) {
  return channel.presence.enter();
}

function leaveChannel(channel) {
  return channel.presence.leave();
}

function presenceChannelSubscribe(presenceChannel, setOnlineUsers, subscribe) {
  if (subscribe === 'enter') {
    return (
      presenceChannel.presence.subscribe(subscribe, function(member) {
        setOnlineUsers(prevState => {
          return [...prevState, {name: member.clientId.replace(/^([^:]+)-/, '')}];
        });
      })
    );
  } else if (subscribe === 'leave') {
    return (
      presenceChannel.presence.subscribe(subscribe, function(member) {
        setOnlineUsers(prevState => {
          return prevState.filter((user) => user.name !== member.clientId.replace(/^([^:]+)-/, ''));
        });
      })
    );
  }
}

function channelPublish(channel, text, isAdminChannel, addressee, currentUser) {
  if (isAdminChannel) {
    return channel.publish('adminMessage', {message: text});
  }

  return channel.publish(chatName(addressee, currentUser), { text });
}

function channelSubscribe(channel, setMessages, isAdminChannel, user, currentUser) {
  if (isAdminChannel) {
    return channel.subscribe('adminMessage', (data) => {
      setMessages(prevState => {
        return [...prevState, data.data.message];
      });
    })
  }

  return (
    channel.subscribe(chatName(user, currentUser), (data) => {
      const myMessage = data.clientId === `id-${currentUser}`;
      setMessages(prevState => {
        return [...prevState, {message: data.data.text, myMessage}];
      });
    })
  );
}

function presenceChannelGet(presenceChannel, setOnlineUsers, isAdminChannel, currentUser, chatChannel) {
  if (isAdminChannel) {
    return (
      presenceChannel.presence.get(function(err, members) {
        members.forEach((member) => {
          setOnlineUsers(prevState => {
            return [...prevState, {name: member.clientId.replace(/^([^:]+)-/, '')}];
          });
        });
      })
    );
  }

  return (
    presenceChannel.presence.get(function(err, members) {
      members.forEach((member) => {
        setOnlineUsers(prevState => {
          return [...prevState, {name: member.clientId.replace(/^([^:]+)-/, '')}];
        });
      });
      for (let i in members) {
        if (members[i].clientId !== `id-${currentUser}`) {
          chatChannel.publish('userInfo', {
            name: currentUser
          });
        }
      }
    })
  );
}

export default new AblyApi();
