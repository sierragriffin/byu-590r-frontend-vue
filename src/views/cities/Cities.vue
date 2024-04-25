<template>
    <!-- <v-row v-if="!isMobile()"> -->
    <v-col cols="11">
        <v-btn color="green" @click="openCreateDialog()" prepend-icon="mdi-plus">Create</v-btn>
    </v-col>
    <!-- </v-row> -->


    <v-row>
        <v-col v-for="city in sortedCities" :key="city.id" class="d-flex child-flex" cols="12" sm="6" md="5" lg="4"
            xl="3" xxl="2">
            <v-card>

                <v-card-item class="text-container">

                    <v-card-title>
                        <v-row>
                            <v-col cols="8" class="bold-text">
                                {{ city.name }}
                            </v-col>

                            <v-col cols="3">
                                <div class="d-flex">
                                    <p>&nbsp;</p>
                                    <v-btn round @click="openEditCityDialog(city)" icon="mdi-pencil" color="warning"
                                        size="x-small"></v-btn>
                                    <v-btn round @click="openDeleteCityDialog(city)" icon="mdi-delete" color="error"
                                        size="x-small"></v-btn>
                                </div>
                            </v-col>

                        </v-row>
                    </v-card-title>

                    <br>
                    <div class="image-container">
                        <v-img :src="city.file" class="mx-auto d-block" max-width="100%" height="200px" contain></v-img>
                    </div>


                    <br>

                    <v-card-subtitle class="text-container">{{ city.description }}</v-card-subtitle>
                    <br>
                    <v-card-subtitle v-if="city.capital" class="bold-text">
                        Capital — (1:1)
                        <li class="lighter-text">{{ city.capital.name }}</li>
                    </v-card-subtitle>
                    <!-- <v-card-subtitle>
                        Capital: {{ city.capital_name }}
                    </v-card-subtitle> -->
                    <br>
                    <v-card-subtitle class="bold-text">
                        Popular Attractions — (1:*)
                        <li v-for="attraction in city.attractions" :key="attraction.id" class="lighter-text">
                            {{ attraction.name }}
                        </li>
                    </v-card-subtitle>

                    <br>
                    <v-card-subtitle class="bold-text">
                        Former/Current Visitors — (*:*)
                        <li v-for="person in city.people" :key="person.id" class="lighter-text">
                            {{ person.fullname }}
                        </li>
                    </v-card-subtitle>


                    <v-card-item>
                        <!-- <v-img
                            :class="{ 'pa-4 text-center rounded-0': true }"
                            width="300" height="400" :src="city.file">
                        </v-img> -->

                        <!-- <v-img
                            :src="city.file"
                            class="mx-auto d-block"
                            max-width="100%"
                            contain
                        ></v-img> -->
                    </v-card-item>

                </v-card-item>

            </v-card>
        </v-col>
    </v-row>
    <!-- </v-row> -->

    <v-dialog v-model="createCityDialog" persistent class="my-dialog" max-width="650px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Create a New Prefecture</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="newCity.name" label="Prefecture Name*" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="newCity.description" label="Prefecture Description*"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select v-model="newCity.capital_id" :items="capitalCities" item-title="text"
                                item-value="value" label="Capital City*" required>
                            </v-select>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <v-select v-model="newCity.attraction_ids" :items="attractionItems" item-title="text"
                                item-value="value" label="Attractions" multiple chips :close-on-select="false"
                                :clearable="true" :small-chips="true"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-file-input accept="image/*" @change="onNewCityFileChange" label="File*"></v-file-input>
                        </v-col>
                    </v-row>
                </v-container>
                <small>* indicates required field</small>

                <v-alert v-if="newCityErrorMessage" type="error">{{ newCityErrorMessage }}</v-alert>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" :disabled="newCityErrorMessage" variant="text"
                    @click="closeCreateDialog()">
                    Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="createCity()" :loading="cityIsCreating"
                    :disabled="cityIsCreating">
                    Save
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>

    <v-dialog v-model="editCityDialog" persistent class="my-dialog" max-width="650px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit {{ editCity.name }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editCity.name" label="Prefecture Name*" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editCity.description" label="Prefecture Description*"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select v-model="editCity.capital_id" :items="capitalCities" item-title="text"
                                item-value="value" label="Capital City*" required>
                            </v-select>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <v-select v-model="editCity.attraction_ids" :items="attractionItems" item-title="text"
                                item-value="value" label="Attractions" multiple chips :close-on-select="false"
                                :clearable="true" :small-chips="true"></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">

                            <div v-if="editFileChangeDialogBtn">
                                <v-file-input accept="image/*" @change="onExistingCityPictureChange"
                                    label="File Change"></v-file-input>
                                <v-btn @click="editFileChangeDialogBtn = false">Cancel File Change</v-btn>
                            </div>

                            <v-btn v-else @click="editFileChangeDialogBtn = true">Change File</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
                <small>*indicates required field</small>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" :disabled="editCityErrorMessage" variant="text"
                    @click="editCityDialog = false">
                    Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="updateCity()" :loading="cityIsUpdating"
                    :disabled="cityIsUpdating">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>

    <v-dialog v-model="deleteCityDialog" width="auto">
        <v-card>
            <v-card-text>
                Are you sure you wish to delete this record? This cannot be undone!
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" @click="deleteCityDialog = null">No</v-btn>
                <v-btn color="green" @click="deleteCity()" :loading="cityIsDeleting"
                    :disabled="cityIsDeleting">Yes</v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>


</template>
<script src="./Cities.ts"></script>
<style src="./Cities.scss"></style>