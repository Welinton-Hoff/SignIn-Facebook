import React, {useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

const App = () => {
  const [userInfo, setUserInfo] = useState({});
  const [token, setToken] = useState('');

  function getInfoFromToken(token) {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name, email, picture',
      },
    };

    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          setUserInfo(result);
          console.log(result);
        }
      },
    );

    new GraphRequestManager().addRequest(profileRequest).start();
  }

  function onFacebookSignIn(error, result) {
    if (error) {
      console.log('login has error: ' + JSON.stringify(result));
    } else if (result.isCancelled) {
      console.log('login is cancelled.');
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        const accessToken = data.accessToken.toString();
        getInfoFromToken(accessToken);
        setToken(accessToken);
      });
    }
  }

  return (
    <View style={styles.container}>
      <LoginButton
        onLoginFinished={(error, result) => onFacebookSignIn(error, result)}
        onLogoutFinished={() => setUserInfo({})}
      />
      {userInfo.name && (
        <View style={styles.containerUseInfo}>
          <View style={styles.userName}>
            <Text style={{fontSize: 16}}>Logged in As {userInfo.name}</Text>

            <Image
              style={styles.picture}
              source={{uri: userInfo.picture.data.url}}
            />
          </View>

          <View style={styles.containerUseInfo}>
            <Text style={{fontSize: 16, marginVertical: 10}}>
              First name: {userInfo.first_name}
            </Text>

            <Text style={{fontSize: 16, marginVertical: 10}}>
              Last name: {userInfo.last_name}
            </Text>

            <Text style={{fontSize: 16, marginVertical: 10}}>
              Name: {userInfo.name}
            </Text>

            <Text style={{fontSize: 16, marginVertical: 10}}>
              E-mail: {userInfo.email}
            </Text>

            <Text style={{fontSize: 16, marginVertical: 10}}>
              User ID: {userInfo.id}
            </Text>

            <Text style={{fontSize: 16, marginVertical: 10}}>
              Access token: {token}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerUseInfo: {
    width: '100%',
    padding: 10,
  },
  userName: {
    width: '100%',
    height: 60,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  picture: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginLeft: 15,
  },
});

export default App;
