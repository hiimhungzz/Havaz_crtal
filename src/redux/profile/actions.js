export const actions = {
    EDIT_PROFILE: 'EDIT_PROFILE',
    editProfile: (params) => {
        console.log("actioneditprofile",params )
        return ({
            type: actions.EDIT_PROFILE,
            payload: {
                params
            }
        })
    },
    EDIT_PROFILE_SUCCESS: 'EDIT_PROFILE_SUCCESS',
    editProfileSuccess: (params) => {
        return ({
            type: actions.EDIT_PROFILE_SUCCESS,
            payload: {
                params
            }
        })
    },   
}