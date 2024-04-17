import './index.css'

const SimilarJobs = props => {
  const {similarJobData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobData
  console.log(similarJobData)
  return (
    <li>
      <img src={companyLogoUrl} alt="similar job company logo" />
      <h1>{title}</h1>
      <p>{rating}</p>
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <p>{employmentType}</p>
      <p>{location}</p>
    </li>
  )
}
export default SimilarJobs
