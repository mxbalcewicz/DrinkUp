import Routes from "./src/navigation/index";
import * as Notifications from "expo-notifications";


Notifications.scheduleNotificationAsync({
  content: {
    title: 'Every hour is happy hour!',
    body: "Remember to drink a lot.. of water!"
  },
  trigger: {
    seconds: 60*60,
    repeats: true,
  },
});


const App = () => {
  return <Routes />;
};

export default App;
