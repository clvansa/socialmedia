import * as yup from 'yup';
import { string } from 'yup/lib/locale';
const changePasswordSchema = yup.object().shape({
    oldPassword: yup.string().min(6, "Password must be at least 6 characters").max(24, "Password must be at most 24 characters").required(),
    newPassword: yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(24, "Password must be at most 24 characters").required(""),
    rePassword: yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(24, "Password must be at most 24 characters").oneOf([yup.ref('newPassword'), null]).required(),

})


const accountSettingSchema = yup.object().shape({
    firstName: yup.string().notRequired().test('first_name', 'first name must be at least 3 characters', function (value) {
        if (!!value) {
            const schema = yup.string().min(3)
            return schema.isValidSync(value)
        }
        return true
    }),
    lastName: yup.string().min(3).max(24),
    mobile: yup.number().positive().min(10)

})


const registerSchema = yup.object().shape({
    username: yup.string().min(3).max(16).required('User name is required'),
    email: yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: yup.string().min(6).max(24).required('Must be not empty'),
    rePassword: yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(24, "Password must be at most 24 characters").oneOf([yup.ref('password'), null]).required(),
})


const resetPasswordSchema = yup.object().shape({
    password: yup.string().min(6).max(24).required('Must be not empty'),
    rePassword: yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(24, "Password must be at most 24 characters").oneOf([yup.ref('password'), null]).required(),
})


export { changePasswordSchema, accountSettingSchema, registerSchema, resetPasswordSchema }