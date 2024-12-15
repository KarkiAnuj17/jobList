'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { FaHeart } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { BsHandbag } from "react-icons/bs";
import Link from "next/link";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [viewFavorites, setViewFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Number of jobs per page
  const router = useRouter();

  useEffect(() => {
    fetch("/record.json") // Assumes your jobs are stored here
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const toggleFavorite = (jobId) => {
    setFavorites((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleSeeDetail = (jobId) => {
    router.push(`/job/${jobId}`); // Navigate to job detail page
  };

  const displayedJobs = viewFavorites
    ? jobs.filter((job) => favorites.includes(job.id))
    : jobs;

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = displayedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(displayedJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Listings</h1>
        <Button
          className="bg-gray-600 text-white rounded"
          onClick={() => setViewFavorites(!viewFavorites)}
        >
          {viewFavorites ? "View All Jobs" : "View Favorites"}
        </Button>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : currentJobs.length === 0 ? (
        <p>{viewFavorites ? "No favorite jobs found." : "No jobs available."}</p>
      ) : (
        <>
          {currentJobs.map((job) => (
            <Card key={job.id} className="mb-4 shadow-md hover:shadow-lg">
              <CardHeader>
                <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p>{job.company.name} - {job.location.type}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="flex gap-4 text-gray-500 my-2">
                  <span className="flex items-center gap-1">
                    <IoLocationOutline /> {job.location.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <BsHandbag /> {job.details.jobType}
                  </span>
                  <span className="flex items-center gap-1">
                    <RiMoneyDollarCircleFill /> {job.details.salaryRange}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {job.details.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 px-2 py-1 text-sm rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  Posted: {job.applicationDetails.postedDate}
                </p>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => toggleFavorite(job.id)}
                  className={`${
                    favorites.includes(job.id) ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  <FaHeart /> {favorites.includes(job.id) ? "Favorited" : "Favorite"}
                </Button>
                <div className="flex gap-2">
                  <Button
                    className="bg-gray-300 text-black"
                    onClick={() => handleSeeDetail(job.id)} // View Details
                  >
                    See Details
                  </Button>
                  <Link href="/apply">                 
                <Button className="bg-black text-white" >Apply</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 gap-2">
            <Button
              className="bg-gray-300"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <Button
                key={number}
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {number}
              </Button>
            ))}
            <Button
              className="bg-gray-300"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobList;
