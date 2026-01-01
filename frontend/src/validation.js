import * as Yup from 'yup'

export const signUpSchema = t => (Yup.object().shape({
  username: Yup.string()
    .trim()
    .required(t('validation.required'))
    .min(3, t('validation.signUp'))
    .max(20, t('validation.signUp')),
  password: Yup.string()
    .required(t('validation.required'))
    .min(6, t('validation.minPas')),
  confirmPassword: Yup.string()
    .required(t('validation.required'))
    .oneOf([Yup.ref('password'), null], t('validation.confirm')),
}))

export const validationSchema = (t, channels) => (Yup.object({
  name: Yup.string()
    .trim()
    .min(3, t('validation.min'))
    .max(20, t('validation.max'))
    .required(t('validation.required'))
    .test('unique', t('validation.channelIsExist'), (value) => {
      if (!value) return true
      return !channels.some(ch =>
        ch.name.toLowerCase() === value.toLowerCase().trim(),
      )
    }),
}))
