# -*- encoding: utf-8 -*-
# stub: sinatra-json 0.1.0 ruby lib

Gem::Specification.new do |s|
  s.name = "sinatra-json"
  s.version = "0.1.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Konstantin Haase", "Postmodern"]
  s.date = "2015-03-01"
  s.description = "sinatra/json extracted from sinatra-contrib."
  s.email = "postmodern.mod3@gmail.com"
  s.extra_rdoc_files = ["ChangeLog.md", "LICENSE.txt", "README.md"]
  s.files = ["ChangeLog.md", "LICENSE.txt", "README.md"]
  s.homepage = "https://github.com/postmodern/sinatra-json#readme"
  s.licenses = ["MIT"]
  s.rubygems_version = "2.5.1"
  s.summary = "The json method for sinatra"

  s.installed_by_version = "2.5.1" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<multi_json>, ["~> 1.0"])
      s.add_runtime_dependency(%q<sinatra>, ["~> 1.0"])
      s.add_development_dependency(%q<rake>, ["~> 10.0"])
      s.add_development_dependency(%q<rubygems-tasks>, ["~> 0.2"])
      s.add_development_dependency(%q<rspec>, ["~> 2.4"])
      s.add_development_dependency(%q<rack-test>, ["~> 0.6"])
      s.add_development_dependency(%q<yard>, ["~> 0.8"])
    else
      s.add_dependency(%q<multi_json>, ["~> 1.0"])
      s.add_dependency(%q<sinatra>, ["~> 1.0"])
      s.add_dependency(%q<rake>, ["~> 10.0"])
      s.add_dependency(%q<rubygems-tasks>, ["~> 0.2"])
      s.add_dependency(%q<rspec>, ["~> 2.4"])
      s.add_dependency(%q<rack-test>, ["~> 0.6"])
      s.add_dependency(%q<yard>, ["~> 0.8"])
    end
  else
    s.add_dependency(%q<multi_json>, ["~> 1.0"])
    s.add_dependency(%q<sinatra>, ["~> 1.0"])
    s.add_dependency(%q<rake>, ["~> 10.0"])
    s.add_dependency(%q<rubygems-tasks>, ["~> 0.2"])
    s.add_dependency(%q<rspec>, ["~> 2.4"])
    s.add_dependency(%q<rack-test>, ["~> 0.6"])
    s.add_dependency(%q<yard>, ["~> 0.8"])
  end
end
