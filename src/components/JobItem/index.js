import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const JobItem = props => {
  const {eachJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJobDetails
  return (
    <>
      <Link to={`jobs/${id}`}>
        <li>
          <img src={companyLogoUrl} alt="company logo" />
          <h1>{title}</h1>
          <AiFillStar />
          <p>{rating}</p>
          <MdLocationOn />
          <p>{location}</p>
          <p>{employmentType}</p>
          <hr />
          <p>{packagePerAnnum}</p>
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </li>
      </Link>
    </>
  )
}
export default JobItem
