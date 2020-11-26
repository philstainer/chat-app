import Joi from 'joi';

export const sendEmailSchema = Joi.object()
  .keys({
    to: Joi.string().email().required(),
    from: Joi.string().email().required(),
    subject: Joi.string().required(),
    html: Joi.string().required(),
  })
  .required();
