function generatePaths(apiPath) {
  return {
    login: `${apiPath}/login`,
    signup: `${apiPath}/signup`,
    data: `${apiPath}/data`,
    httpDataPath: `${apiPath}/data`,
    homePage: '/',
    loginPage: '/login',
    signupPage: '/signup',
  };
}

const apiPath = '/api/v1';
const paths = generatePaths(apiPath);

export default paths;
