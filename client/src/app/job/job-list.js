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
  const jobsPerPage = 2;
  const router = useRouter();

  useEffect(() => {
    fetch("/record.json")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const toggleFavorite = (jobId) => {
    const jobIdString = String(jobId); // Ensure IDs are strings
    setFavorites((prev) =>
      prev.includes(jobIdString)
        ? prev.filter((id) => id !== jobIdString)
        : [...prev, jobIdString]
    );
  };

  const handleSeeDetail = (jobId) => {
    router.push(`/job/${jobId}`);
  };

  const displayedJobs = viewFavorites
    ? jobs.filter((job) => favorites.includes(String(job.id))) // Compare as strings
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
                <div className="flex gap-2 flex-wrap m-1">
                  {job.details.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-800 m-1 px-3 py-2 text-sm text-white rounded-large"
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
                    favorites.includes(String(job.id)) ? "bg-red-600 text-white" : "text-black"
                  }`}
                >
                  <FaHeart /> {favorites.includes(String(job.id)) ? "Favorited" : "Favorite"}
                </Button>
                <div className="flex gap-2">
                  <Button
                    className="bg-gray-300 text-black"
                    onClick={() => handleSeeDetail(job.id)} 
                  >
                    See Details
                  </Button>
                  <Link href="/apply">                 
                    <Button className="bg-black text-white">Apply</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}

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
