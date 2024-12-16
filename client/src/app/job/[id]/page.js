'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, CardHeader, CardBody, Divider, CardFooter } from '@nextui-org/react';
import { FaLocationArrow } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { BsHandbag } from 'react-icons/bs';
import Link from 'next/link';

const JobDetail = ({ params }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = React.use(params);

  useEffect(() => {
    if (id) {
      fetch(`/record.json`)
        .then((res) => res.json())
        .then((data) => {
          const foundJob = data.find((job) => job.id === id); 
          if (foundJob) {
            setJob(foundJob);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching job details:', err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (!job) {
    return <p>Job not found.</p>;
  }

  return (
    <div className="p-8">
        
      <Card className="mb-6 w-full max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold">{job.title}</h2>
          <p className="text-l text-gray-500">
            {job.company.name} - {job.location.type}
          </p>
        </CardHeader>

        <Divider />

        <CardBody>
          <p className="text-gray-600 text-xl mb-4">{job.description}</p>

          <p className="text-gray-400 text-l mb-2 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <IoLocationOutline />
              {job.location?.address || 'N/A'}
            </span>
            |
            <span className="flex items-center gap-1">
              <BsHandbag />
              {job.details?.jobType || 'N/A'}
            </span>
            |
            <span className="flex items-center gap-1">
              <RiMoneyDollarCircleFill />
              {job.details?.salaryRange || 'N/A'}
            </span>
          </p>

          <p className="text-gray-400 text-sm">
            Posted: {job.applicationDetails?.postedDate || 'N/A'} | ID: {job.id || 'N/A'}
          </p>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">Key Responsibilities</h3>
            <ul className="list-disc ml-4">
              {job.details?.keyResponsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">Required Skills</h3>
            <ul className="list-disc ml-4">
              {job.details?.requiredSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">Preferred Skills</h3>
            <ul className="list-disc ml-4">
              {job.details?.preferredSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">Benefits</h3>
            <ul className="list-disc ml-4">
              {job.details?.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

        
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Interview Process</h3>
            <ul className="list-disc ml-4">
              {job.interviewProcess.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">Additional Information</h3>
            <p>{job.additionalInfo?.diversityInclusionStatement || 'N/A'}</p>
          </div>
        </CardBody>

        <Divider />

        <CardFooter className="flex justify-between items-center">
          <Link href="/apply">
          <Button variant="bordered" size="xl" startContent={<FaLocationArrow />} className="bg-black text-white">
            Apply
          </Button>
          </Link>
          <Link href="/"> <Button className="text-xl items-center bg-black text-white">Return to Job Listing</Button></Link>

        </CardFooter>
      </Card>
    </div>
  );
};

export default JobDetail;
