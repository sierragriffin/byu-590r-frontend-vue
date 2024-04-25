<script  lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LoginView from './views/login/LoginView.vue'
import { mapState } from 'vuex'
import { ref } from 'vue'
export default {
  setup() {
    const theme = ref('dark');
    function changeTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    };

    return { theme, changeTheme };
  },
  name: 'App',
  components: {
    LoginView,
    RouterLink,
    RouterView
  },
  data: function () {
    return {
      profileDialog: false,
      profileIsUploading: false,
      verificationEmailLoading: false,
      showEmailNotVerifiedDialog: false,
      showChangeEmailTextField: false,
      changeEmail: false,
      successVerificationMessage: '',
      changeEmailRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      profile: 
      {
        avatar: '',
        name: '',
        title: '',
        icon: 'mdi-account-circle',
        color: 'info'
      },
      profilePictureImage: '',
      emailOfVerification: ''
    }
  },
  computed: {
    ...mapState({
      user() {
        return this.$store.state.user.user;
      },
      auth() {
        return this.$store.state.auth;
      },
      authUser() {
        return this.auth.user;
      },
      isAuthenticated() {
        return this.auth.status.loggedIn && (this.authUser.token !== undefined);
      },
      title() {
        return 'Welcome ' + this.authUser.name + '!';
      },
      avatarURL() {
        return this.auth.user.avatar;
      },
      profilePictureChangeLabel() {
        return 'Profile picture change';
      }
    }),

  },
  watch: {
    showChangeEmailTextFiled() {

      if (this.showChangeEmailTextField) {
        this.changeEmail = this.user.email;
      }
    }
  },
  updated() {

    if (this.isAuthenticated) {
      this.$router.push({ name: 'home' });
    }
  },
  created() {
    if (this.authUser) {
      this.getCurrentUser();
    }
  },
  mounted() {

  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    },
    getCurrentUser() {
      this.profile.name = this.authUser.name;

      this.profile.title = this.title;
      this.$store.dispatch("user/getUser").then(
        (response) => {
          if (response.avatar) {
            this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          
          }
          if (!response.email_verified_at) {
            this.showEmailNotVerifiedDialog = true;
          }
        }
      )
    },

    checkAuth(auth) {
      console.log('Authenticated!', auth)
    },
    onAvatarChange(e) {
      var image = e.target.files || e.dataTransfer.files;

      if (!image.length) 
        return;
      this.profileIsUploading = true;
      this.$store.dispatch("user/uploadAvatar", image[0], { root: true }).then(
        (response) => {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          this.profileIsUploading = false;
        },

      ).catch((error) => {
        console.log(error);
        alert('Error. Try again');
        this.profileIsUploading = false;
      });
    },
    removeAvatar() {
      this.profileIsUploading = true;
      this.$store.dispatch("user/removeAvatar").then(
        (response) => {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          this.profileIsUploading = false;
        },

      ).catch((error) => {
        console.log(error);
        alert('Error. Try again');
        this.profileIsUploading = false;
      });
    }

  }
}
</script>
<template>
  <v-app :theme="theme">
    <v-app-bar v-if="isAuthenticated">
      <v-spacer></v-spacer>
      <v-btn to="/" default>Home</v-btn>
      <v-btn to="about">About</v-btn>
      <v-btn to="cities">Japan's Prefectures</v-btn>

      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="profile.color" size="large">
              <v-img icon v-bind="props" v-if="avatarURL" alt="Avatar" :src="avatarURL"></v-img>
              <v-icon v-bind="props" v-else :color="profile.color" :icon="profile.icon"></v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <h3>{{ profile.name }}</h3>
              <v-divider class="my-3"></v-divider>
              <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" 
                @click="changeTheme">Toggle Theme
              </v-btn>
              <v-btn @click="profileDialog = true">profile
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn @click="logout();">Logout</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <div v-if="isAuthenticated">
          <RouterView />
        </div>
        <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
      </v-container>

     <v-dialog v-model="profileDialog">
      <v-form>
        <v-card>
          <v-card-title>Profile</v-card-title>
          <v-card-subtitle>Enter your profile options here</v-card-subtitle>
          <!-- <v-card class="mx-auto" max-width="500" rounded="50">
            <v-img cover v-if="avatarURL" :src="avatarURL"></v-img>
            <v-icon v-else :color="profile.color" :icon="profile.icon"></v-icon>

            <v-file-input accept="image/*" :loading="profileIsUploading" :disabled="profileIsUploading"
              @change="onAvatarChange($event)" :label="profilePictureChangeLabel"></v-file-input>
          
          </v-card> -->

        
          <v-container>
            <v-row justify="center">
              <v-col>
                <v-card style="max-width: 434px; margin-left: auto; margin-right: auto;" rounded="50">
                  <v-img cover v-if="avatarURL" :src="avatarURL"></v-img>
                  <v-icon v-else :color="profile.color" :icon="profile.icon"></v-icon>

                  <v-file-input accept="image/*" :loading="profileIsUploading" :disabled="profileIsUploading"
                    @change="onAvatarChange($event)" :label="profilePictureChangeLabel"></v-file-input>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
      

          <v-card-actions>
            <v-btn :loading="profileIsUploading" :disabled="profileIsUploading" @click="removeAvatar()">Remove Profile Picture</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>

     </v-dialog>
   </v-main>
  </v-app>
</template>




 <!-- <v-app :theme="theme">
   <v-app-bar :title="(authUser.name === undefined) ? '' : title" v-if="isAuthenticated">
     <v-spacer></v-spacer>
     <v-btn to="/" default>Home</v-btn>
     <v-btn to="about">About</v-btn>
     <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="changeTheme">Toggle
       Theme</v-btn>
     <v-btn @click="logout();">Logout</v-btn>
   </v-app-bar>

   <v-main>
     <v-container>
       <div v-if="isAuthenticated">
         <RouterView />
       </div>
       <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
     </v-container>
   </v-main>
 </v-app> -->

<!-- <script  lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LoginView from './views/login/LoginView.vue'
import { mapState } from 'vuex'
import { ref } from 'vue'
export default {
 setup() {
   const theme = ref('dark');
   function changeTheme() {
     theme.value = theme.value === 'light' ? 'dark' : 'light'
   }
   return { theme, changeTheme };
 },
 name: 'App',
 components: {
   LoginView,
   RouterLink,
   RouterView
 },

 computed: mapState({
   authUser() {
     return this.$store.state.auth.user;
   },
   isAuthenticated() {
     return this.$store.state.auth.status.loggedIn && (this.authUser.token !== undefined);
   },
   title() {
     return 'Welcome ' + this.authUser.name + '!'
   }
 }),
 updated() {

   if (this.isAuthenticated) {
     this.$router.push({ name: 'home' });
   }
 },
 methods: {
   logout() {
     this.$store.dispatch("auth/logout");
   },
   checkAuth(auth) {
     console.log('Authenticated!', auth)
   }
 }
}
</script>
<template>
 <v-app :theme="theme">
   <v-app-bar :title="(authUser.name === undefined) ? '' : title" v-if="isAuthenticated">
     <v-spacer></v-spacer>
     <v-btn to="/" default>Home</v-btn>
     <v-btn to="about">About</v-btn>
     <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="changeTheme">Toggle
       Theme</v-btn>
     <v-btn @click="logout();">Logout</v-btn>
   </v-app-bar>

   <v-main>
     <v-container>
       <div v-if="isAuthenticated">
         <RouterView />
       </div>
       <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
     </v-container>
   </v-main>
 </v-app>
</template> -->
