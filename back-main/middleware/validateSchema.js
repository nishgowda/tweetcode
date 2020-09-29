const Joi = require('joi');

// POST and PUT schema that must be met, else user is alerted of the error is preventend
// from saving any data.
const validatePost = (codeTweet) => {
    const schema = Joi.object({code: Joi.string().min(3).required(), language: Joi.string().min(1).required(), title: Joi.string().min(3).required(), status: Joi.string().min(5).required()})
    return result = schema.validate(codeTweet);
}
const validateUpdate = (codeTweet) => {
    const schema = Joi.object({cid: Joi.number().min(1).required(), code: Joi.string().min(3).required(), language: Joi.string().min(1).required(), title: Joi.string().min(3).required(), status: Joi.string().min(5).required()})
    return result = schema.validate(codeTweet);
}
const validateSearchQuery = (query) => {
    const schema = Joi.string().min(1).required()
    return result = schema.validate(query);
}
const valideReviewPost = (review) => {
    const schema = Joi.object({ review: Joi.string().min(3).required(), score: Joi.number().required().min(0), owner_id: Joi.number().min(1).required(), cid: Joi.number().required()});
    return result = schema.validate(review)
}
const valideReviewUpdate = (review) => {
    const schema = Joi.object({ rid: Joi.number().min(1).required(), review: Joi.string().min(3).required(), score: Joi.number().required().min(0) });
    return result = schema.validate(review)
}
module.exports = {
    validatePost,
    validateUpdate,
    validateSearchQuery,
    valideReviewPost,
    valideReviewUpdate
};
