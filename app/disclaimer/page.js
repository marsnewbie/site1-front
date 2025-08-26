"use client";
import Link from 'next/link';
import Header from '../components/Header';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Service Disclaimer</h1>
            
            <div className="prose max-w-none space-y-6">
              <h2 className="text-xl font-semibold mb-4">DISCLAIMER FOR INTERACTIVE SERVICES</h2>
              
              <p className="mb-4">
                China Palace maintains the interactive portion(s) of their Web site as a service free of charge. By using any interactive services provided herein, you are agreeing to comply with and be bound by the terms, conditions and notices relating to its use.
              </p>

              <ol className="list-decimal list-inside space-y-4">
                <li>
                  As a condition of your use of this Web site and the interactive services contained therein, you represent and warrant to China Palace that you will not use this Web site for any purpose that is unlawful or prohibited by these terms, conditions, and notices.
                </li>
                
                <li>
                  China Palace reserves the right at all times to disclose any information deemed by China Palace necessary to satisfy any applicable law, regulation, legal process or governmental request, or to edit, refuse to post or to remove any information or materials, in whole or in part.
                </li>
                
                <li>
                  The information, products, and services included on this Web site may include inaccuracies or typographical errors. Changes are periodically added to the information herein. China Palace may make improvements and/or changes in this Web site at any time. Advice received via this Web site should not be relied upon for personal, legal or financial decisions and you should consult an appropriate professional for specific advice tailored to your situation.
                </li>
                
                <li>
                  China Palace makes no representations about the suitability, reliability, timeliness, and accuracy of the information, products, and services contained on this web site for any purpose. All such information, products, and services are provided "as is" without warranty of any kind.
                </li>
                
                <li>
                  China Palace hereby disclaims all warranties and conditions with regard to the information, products, and services contained on this web site, including all implied warranties and conditions of merchantability, fitness for a particular purpose, title and non-infringement.
                </li>
                
                <li>
                  In no event shall China Palace be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>with the use or performance of this web site,</li>
                    <li>with the delay or inability to use this web site,</li>
                    <li>with the provision of or failure to provide services, or</li>
                    <li>for any information, software, products, services and related graphics obtained through this web site, or otherwise arising out of the use of this web site, whether based on contract, tort, strict liability or otherwise, even if China Palace has been advised of the possibility of damages.</li>
                  </ul>
                </li>
                
                <li>
                  Due to the fact that certain jurisdictions do not permit or recognize an exclusion or limitation of liability for consequential or incidental damages, the above limitation may not apply to you. If you are dissatisfied with any portion of this web site, or with any of these terms of use, your sole and exclusive remedy is to discontinue using this web site.
                </li>
                
                <li>
                  China Palace reserves the right in its sole discretion to deny any user access to this Web site, any interactive service herein, or any portion of this Web site without notice, and the right to change the terms, conditions, and notices under which this Web site is offered.
                </li>
                
                <li>
                  This Agreement contains the entire agreement between the parties relating to the subject matter hereof and supersedes any and all prior agreements or understandings, written or oral, between the parties related to the subject matter hereof. No modification of this Agreement shall be valid unless made in writing and signed by both of the parties hereto.
                </li>
                
                <li>
                  This Agreement shall be governed by and construed in accordance with the laws of United Kingdom.
                </li>
              </ol>
              
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Binding Effect</h3>
                <p className="text-sm">
                  This Agreement shall be binding upon all who use China Palace services, property, and other assets mentioned in this agreement with respect to this Web site and associated content, and it supersedes all prior or contemporaneous communications and proposals, whether electronic, oral or written with respect to this Web site. A printed version of this agreement and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to this agreement to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form. Fictitious names of companies, products, people, characters and/or data mentioned herein are not intended to represent any real individual, company, product or event. Any rights not expressly granted herein are reserved.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Last updated: January 2025
              </p>
              <p className="text-sm text-gray-600 mt-2">
                If you have any questions about this disclaimer, please contact us.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ul className="flex flex-wrap justify-center space-x-6 mb-4">
              <li><Link href="/" className="text-gray-700 hover:text-gray-900">HOME</Link></li>
              <li><Link href="/about" className="text-gray-700 hover:text-gray-900">ABOUT US</Link></li>
              <li><Link href="/terms" className="text-gray-700 hover:text-gray-900">TERMS & CONDITIONS</Link></li>
              <li><Link href="/privacy" className="text-gray-700 hover:text-gray-900">PRIVACY POLICY</Link></li>
              <li><Link href="/cookies" className="text-gray-700 hover:text-gray-900">COOKIE POLICY</Link></li>
              <li><Link href="/disclaimer" className="text-gray-700 hover:text-gray-900">SERVICE DISCLAIMER</Link></li>
              <li><Link href="/contact" className="text-gray-700 hover:text-gray-900">CONTACT US</Link></li>
            </ul>
            <p className="text-gray-600">
              China Palace © 2025. All rights reserved. Designed By China Palace
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}