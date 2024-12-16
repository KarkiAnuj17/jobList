"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const ApplyJobForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); 

  
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Full Name is required')
      .min(3, 'Full Name must be at least 3 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    resume: Yup.mixed()
      .test(
        'fileSize',
        'File size must be less than 2MB',
        (value) => !value || (value && value.size <= 2 * 1024 * 1024)
      )
      .test(
        'fileType',
        'File type must be PDF, DOC, or DOCX',
        (value) =>
          !value ||
          (value &&
            ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type))
      ),
    coverLetter: Yup.string().required('Cover Letter is required'),
  });

  const initialValues = {
    fullName: '',
    email: '',
    resume: null,
    coverLetter: '',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true); 

    setTimeout(() => {
      console.log('Form Submitted:', values);
      alert('Application Submitted Successfully!');
      setIsSubmitting(false); 
    }, 2000); 
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Apply for Job</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ setFieldValue, resetForm }) => (
          <Form>
            <div className="mb-5">
              <label htmlFor="fullName" className="block text-lg font-medium">Full Name</label>
              <Field name="fullName" type="text" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="fullName" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block text-lg font-medium">Email</label>
              <Field name="email" type="email" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="email" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-5">
              <label htmlFor="resume" className="block text-lg font-medium">Resume (optional)</label>
              <input
                id="resume"
                name="resume"
                type="file"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(event) => {
                  setFieldValue('resume', event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage name="resume" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-5">
              <label htmlFor="coverLetter" className="block text-lg font-medium">Cover Letter</label>
              <Field name="coverLetter" as="textarea" rows="5" className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="coverLetter" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="flex justify-between mt-6">
              <Button
                type="submit"
                className={`px-6 py-3 bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Link href="/">
              <Button className="px-6 py-3 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                Return to Job Listing
              </Button>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ApplyJobForm;
