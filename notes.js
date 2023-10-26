/**
 * models:
 *
 * The Database is on MongoDB,
 * It gives the opportunity to make changes easily in our case
 * We havent yet implemented any sharding since do not have much data
 * We have indexed data do retrieve it easily and fast
 * We also use caching in our server to provide better experience
 *
 * User:
 * {
 * user_id: ObjectId => Generated by MongoDB automatically
 * name: String,
 * surname: String,
 * password: String<hashed>
 * profile: String => the url of the profile picture
 * tokens_used: Integer => the number of tokens the user used in the conversations in total
 * }
 *
 * Conversation:
 * {
 * id: ObjektId => Generated by MongoDB automatically ,
 * user_id: ObjectId <reference to the `users` collection> => this is the user id that shows who the conversation belongs,
 * title: String => title generated for the conversation by OpenAI GPT model (GPT after now)
 * tokens: Number => the total number of tokens used in the conversation
 * tags: Array[String] => this is tags generated by GPT for the current conversation, helps to provide better service to the user
 * }
 *
 * Message:
 * {
 * id: ObjektId => Generated by MongoDB automatically ,
 * conversation_id: ObjectId <reference to the `conversations` collection>
 * role: String[system, assistant, user],
 * content: String => this is what we see when talk to GPT,
 * function_call: Map => This is a function if GPT calls it.
 * tokens: Number => this is how many tokens been used in the message,
 * date: Date => shows the time the message has been created
 * }
 *
 * RoadmapForm: => This is a roadmap form that user fills (can create many of them), it helps to rememeber the form and create a roadmap easily
 * {
 * id: ObjektId => Generated by MongoDB automatically,
 * user_id: ObjectId <reference to the `users` collection> => this is the user id that shows who the conversation belongs,
 * name: String,
 * country: String,
 * age: Number,
 * job_status: String[employed, unemployed],
 * job: String,
 * previous_jobs:  [{name: String, skills: Array, years: Number, months: Number}],
 * skills: Array,
 * interests: Array,
 * academic_background: String,
 * wants_to_be: String => this is the field the user wants to be in,
 * time_has: {years, months, days} => this shows how much time the user has to learn the field,
 * created: Date
 * }
 *
 *
 *
 * Roadmap:
 * {
 * id: ObjektId => Generated by MongoDB automatically,
 * user_id: ObjectId <reference to the `users` collection> => this is the user id that shows who the conversation belongs,
 * steps: [
 *      {step: Number => step number,
 *       title: String,
 *       description: String,
 *       video_sources: Array[String] => the video sources the user need to follow},
 *       other_sources: Array[String]
 *      ]
 * created: Date
 * }
 */

/**
 * APIs
 *
 * GET https://ai.ex-smart.com
 *      Authorised? true
 *      This returns the front for the conversation and requires the user to be logged in
 *
 * POST https://ai.ex-smart.com/api/v1/
 *      Authorised? true
 *      This is the endpoint to talk to the chat
 *
 * >>>
 *
 * GET https://ai.ex-smart.com/api/v1/conversation
 *      Authorised? true
 *      Returns conversations
 * POST https://ai.ex-smart.com/api/v1/conversation
 *      Authorised? true
 *      Creates new conversation
 * GET https://ai.ex-smart.com/api/v1/conversation/:id
 *      Authorised? true
 *      Returns all the messages  belong to the user and belong to the conversation
 *
 *
 * >>>
 *
 * GET https://ai.ex-smart.com/api/v1/roadmap/
 *      Authorised? true
 *      Returns all the roadmaps
 * GET https://ai.ex-smart.com/api/v1/roadmap/:id
 *      Authorised? true
 *      Returns roadmap  belong to the user and with the current id
 * POST https://ai.ex-smart.com/api/v1/roadmap/
 *      Authorised? true
 *      Creates a new roadmap
 *
 *
 * >>
 *
 * GET https://ai.ex-smart.com/api/v1/roadmapforms/
 *      Authorised? true
 *      Returns all the forms belong to the user
 * GET https://ai.ex-smart.com/api/v1/roadmapforms/:id
 *      Authorised? true
 *      Returns all the forms belong to the user and with the ID
 * POST https://ai.ex-smart.com/api/v1/roadmapforms/
 *      Authorised? true
 *      Creates a new roadmap form
 *
 *
 *
 *
 *
 */