const Rules = ({ rules, tournament }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Tournament Rules
        </h2>
        <p className="text-gray-400">
          Official rules and regulations for {tournament}
        </p>
      </div>

      <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
        {rules && rules?.length > 0 ? (
          <div className="space-y-4">
            {rules?.map((rule, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-100 leading-relaxed">{rule}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No rules have been published yet
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Tournament rules will be available soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rules;
