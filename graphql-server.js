var express = require('express');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');
const cors = require('cors');

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

var coursesData = [
    {
        id: 1,
        title: 'GraphQL solves the problem of over-fetching and under-fetching',
        author: 'Get exactly what you want',
        description: 'GraphQL receives client requests and fetches the necessary data according to instructions provided in the request. You get exactly what you need, nothing more and nothing less.',
        topic: 'GraphQL',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'GraphQL provides flexibility and efficiency',
        author: 'Decouple FE from BE',
        description: 'With every change made to the UI, your back-end need not be adjusted to account for the new data needs. Thanks to the flexible nature of GraphQL, changes on the client-side can be made without any extra work on the server. ',
        topic: 'GraphQL',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'GraphQL is an integrator',
        author: 'A unifying layer between the FE and BE',
        description: 'GraphQL is a thin layer in front of a number of third party or legacy systems (REST APIs, JSON Data, SQL, NoSQL DB)',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

var getCourse = function(args) {
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = function({id, topic}) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id)[0];
}

// Root resolver
var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

// Create an expres server and a GraphQL endpoint
var app = express();
app.use(cors());

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Running On 4000/graphql'));