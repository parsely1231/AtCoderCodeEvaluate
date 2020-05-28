import { Submission } from '../../interfaces/interfaces'


function filterAC(submissions: Submission[]) {
  return submissions.filter(submission => submission.result === 'AC');
}

function fileterLanguage(language: string) {
  return (
    function(submissions: Submission[]) {
      return submissions.filter(submission => submission.language === language);
    }
  );
}

function filterNormalContest(submissions: Submission[]) {
  return submissions.filter(submission => submission.contest_id.slice(0, 3) === 'abc' || 'arc' || 'agc')
}


export function fetchUserSubmissions(userName: string, language: string) {
  const PROBLEMS_URL = "/atcoder/atcoder-api";
  const url = `${PROBLEMS_URL}/results?user=${userName}`;
  return (
    fetch(url)
      .then(res => res.json())
      .then(filterAC)
      .then(fileterLanguage(language))
      .then(filterNormalContest)
  )
}