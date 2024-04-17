import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

class AllJobs extends Component {
  state = {
    profileData: {},
    apiStatus: apiStatusConstants.initial,
    activeSalaryRangeId: '',
    searchInput: '',
    jobsData: [],
    activeCheckBoxList: [],
    apiJobStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.initial})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const profile = data.profile_details
      const updatedProfile = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }

      this.setState({
        profileData: updatedProfile,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({apiJobStatus: apiStatusConstants.initial})
    const {searchInput, activeCheckBoxList, activeSalaryRangeId} = this.state
    const type = activeCheckBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const filteredData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsData: filteredData,
        apiJobStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSuccessProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div>
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onSuccessJobsView = () => {
    const {jobsData} = this.state
    const jobsLength = jobsData.length > 0
    return jobsLength ? (
      <>
        <div>
          <ul>
            {jobsData.map(eachJob => (
              <JobItem key={eachJob.id} eachJobDetails={eachJob} />
            ))}
          </ul>
        </div>
      </>
    ) : (
      <>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
          <button type="button">Retry</button>
        </div>
      </>
    )
  }

  onRetryProfileView = () => this.getProfileData()

  onRetryJobs = () => this.getJobsData()

  onFailProfileView = () => (
    <>
      <button type="button" onClick={this.onRetryProfileView}>
        Retry
      </button>
    </>
  )

  onFailJobsView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>

      <button type="button" onClick={this.onRetryJobs}>
        retry
      </button>
    </>
  )

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onSelectSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  onClickCheckBox = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        preState => ({
          activeCheckBoxList: [...preState.activeCheckBoxList, event.target.id],
        }),
        this.getJobsData,
      )
    }
  }

  onGetCheckBoxesView = () => {
    const {activeCheckBoxList} = this.state
    return (
      <ul>
        {employmentTypesList.map(eachList => (
          <li key={eachList.employmentTypeId}>
            <input
              type="checkbox"
              onChange={this.onClickCheckBox}
              value={activeCheckBoxList}
              id={eachList.employmentTypeId}
            />
            <label htmlFor={eachList.employmentTypeId}>{eachList.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  onGetRadioButtonsView = () => (
    <ul>
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId}>
          <input
            type="radio"
            name="option"
            id={eachItem.salaryRangeId}
            onChange={this.onSelectSalaryRange}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onSubmitSearchInput = () => {
    this.getProfileData()
  }

  onRenderSearch = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          type="search"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />

        <button
          data-testid="searchButton"
          type="button"
          onClick={this.onSubmitSearchInput}
        >
          <AiOutlineSearch />
        </button>
      </>
    )
  }

  onRenderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSuccessProfileView()
      case apiStatusConstants.failure:
        return this.onFailProfileView()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  onRenderJobs = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.onSuccessJobsView()
      case apiStatusConstants.failure:
        return this.onFailJobsView()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div>{this.onRenderSearch()}</div>
        {this.onRenderProfile()}
        <hr />
        <h1>Type of Employment</h1>
        {this.onGetCheckBoxesView()}
        <hr />
        <h1>Salary Range</h1>
        {this.onGetRadioButtonsView()}
        <div>
          {this.onRenderSearch()}
          {this.onRenderJobs()}
        </div>
      </>
    )
  }
}
export default AllJobs
